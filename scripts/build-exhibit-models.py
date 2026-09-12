"""Original OpenEngineering mechanical parts. Run with Blender --background --python.
Geometry uses metres only as a convenient scene unit; this is a teaching assembly.
The engine kinematics in src/lib/mechanics.ts define all moving pivots.
"""
import bpy, math, os
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
bpy.context.preferences.filepaths.save_version=0
materials={}
def mat(name,color,metal,rough):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 materials[name]=m;return m
mat('Gear steel',(.19,.24,.29),.94,.32)
mat('Machined steel',(.48,.53,.57),.92,.22);mat('Cast aluminum',(.32,.36,.39),.78,.38)
mat('Dark iron',(.065,.083,.095),.8,.3);mat('Ceramic',(.9,.88,.8),.05,.2)
mat('Copper',(.54,.23,.1),.82,.24);mat('Rubber',(.015,.023,.027),.05,.69)
mat('Intake blue',(.075,.3,.37),.62,.29);mat('Exhaust copper',(.51,.15,.045),.65,.3)
parts={}
def finish(o,material,bevel=.025):
 o.data.materials.append(materials[material])
 if o.type=='MESH':
  for p in o.data.polygons:p.use_smooth=True
  if bevel:
   b=o.modifiers.new('Machined edge','BEVEL');b.width=bevel;b.segments=3
   bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=b.name)
  n=o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL');n.keep_sharp=True
  try:bpy.ops.object.modifier_apply(modifier=n.name)
  except:pass
 return o

def cyl(r,depth,loc=(0,0,0),material='Machined steel',axis='Y',verts=64,bevel=.02):
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=depth,location=loc)
 o=bpy.context.object
 if axis=='Y':o.rotation_euler[0]=math.pi/2
 if axis=='X':o.rotation_euler[1]=math.pi/2
 bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
 return finish(o,material,bevel)
def box(size,loc=(0,0,0),material='Cast aluminum',bevel=.035):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,material,bevel)
def torus(r,t,loc=(0,0,0),material='Machined steel',axis='Y'):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=64,minor_segments=8,location=loc);o=bpy.context.object
 if axis=='Y':o.rotation_euler[0]=math.pi/2
 if axis=='X':o.rotation_euler[1]=math.pi/2
 bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);return finish(o,material,0)
def mesh(name,verts,faces,material,bevel=.01):
 m=bpy.data.meshes.new(name);m.from_pydata(verts,[],faces);m.update();o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);return finish(o,material,bevel)
def tube_curve(points,r,material):
 curve=bpy.data.curves.new('Flow passage','CURVE');curve.dimensions='3D';curve.resolution_u=18;curve.bevel_depth=r;curve.bevel_resolution=4
 if len(points)>12:
  s=curve.splines.new('POLY');s.points.add(len(points)-1)
  for b,p in zip(s.points,points):b.co=(*p,1)
 else:
  s=curve.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
  for b,p in zip(s.bezier_points,points):b.co=p;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
 o=bpy.data.objects.new('Pipe',curve);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False);return finish(o,material,0)
def join(name,objs):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.select_set(True)
 bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=objs[0];o.name=name
 bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR');parts[name]=o;o.select_set(False);return o

def shell(ro,ri,height,arc=math.pi*1.1,material='Cast aluminum'):
 verts=[];faces=[];N=80;start=-arc/2
 for y in [-height/2,height/2]:
  for r in [ro,ri]:
   for i in range(N+1):
    a=start+arc*i/N;verts.append((math.sin(a)*r,y,-math.cos(a)*r))
 for i in range(N):
  for band in [(0,2),(1,3),(0,1),(2,3)]:
   a=band[0]*(N+1)+i;b=band[1]*(N+1)+i;faces.append((a,a+1,b+1,b))
 for i in [0,N]:faces.append((i,N+1+i,3*(N+1)+i,2*(N+1)+i))
 return mesh('Cutaway',verts,faces,material,.014)


# Original assemblies for the second collection. Each library is loaded separately.
def reset():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);parts.clear()
def export(slug):
 bpy.ops.object.select_all(action='DESELECT')
 for o in parts.values():o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(ROOT/f'public/models/{slug}.glb'),export_format='GLB',use_selection=True,export_yup=False,export_apply=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
 for i,o in enumerate(parts.values()):o.location=((i%5)*5,(i//5)*5,0)
 bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/f'assets/source/{slug}.blend'))
 print(slug,len(parts),'semantic parts')
def arc_ring(ro,ri,depth,start,end,material='Machined steel'):
 vv=[];ff=[];N=80
 for z in [-depth/2,depth/2]:
  for r in [ro,ri]:
   for i in range(N+1):
    a=start+(end-start)*i/N;vv.append((r*math.cos(a),r*math.sin(a),z))
 for i in range(N):
  for u,v in [(0,1),(2,3),(0,2),(1,3)]:
   a=u*(N+1)+i;b=v*(N+1)+i;ff.append((a,a+1,b+1,b))
 for i in [0,N]:ff.append((i,N+1+i,3*(N+1)+i,2*(N+1)+i))
 return mesh('Cut ring',vv,ff,material,.012)

# SEWING: rear structure leaves the entire stitch-forming zone exposed.
reset()
join('SewingFrame',[box((2.7,.20,1.25),(0,-1.62,-.13),'Dark iron',.1),box((.4,3.4,.55),(1.05,.1,-.65),'Cast aluminum',.15),box((2.0,.36,.55),(.12,1.74,-.65),'Cast aluminum',.12),box((.5,.78,.55),(-.65,1.46,-.65),'Cast aluminum',.12),*[cyl(.075,.06,(x,-1.49,z),'Machined steel','Y',6,.008) for x in [-1.1,1.1] for z in [-.5,.25]]])
join('Needle',[cyl(.025,.95,(0,.53,0),'Machined steel','Y',16,.005),tube_curve([(-.025,.13,0),(-.028,.045,0),(0,.008,0),(.028,.045,0),(.025,.13,0)],.009,'Machined steel'),cyl(.07,.30,(0,1.13,0),'Dark iron')])
join('NeedleBar',[cyl(.085,1.05,(0,.53,-.07),'Machined steel'),box((.23,.18,.20),(0,.11,-.04),'Dark iron',.018),cyl(.045,.16,(.11,.12,.04),'Machined steel','X',6,.01)])
join('Bobbin',[cyl(.40,.4,material='Intake blue',axis='Z'),*[cyl(.49,.055,(0,0,z),'Machined steel','Z') for z in [-.23,.23]],*[torus(.402,.008,(0,0,z),'Intake blue','Z') for z in [i*.027 for i in range(-7,8)]],cyl(.1,.6,material='Dark iron',axis='Z')])
join('BobbinCase',[arc_ring(.57,.515,.49,math.pi*.18,math.pi*1.82,'Dark iron'),box((.15,.14,.5),(.53,0,0),'Machined steel',.02)])
join('ShuttleHook',[arc_ring(.70,.63,.15,-math.pi*.82,math.pi*.76,'Machined steel'),mesh('Hook tip',[(.63,-.20,.07),(.78,-.38,.07),(.68,-.08,.07),(.63,-.20,-.07),(.78,-.38,-.07),(.68,-.08,-.07)],[(0,1,2),(3,5,4),(0,3,4,1),(1,4,5,2),(2,5,3,0)],'Copper',.008)])
join('ThroatPlate',[box((.42,.05,.90),(-.92,0,0),'Machined steel',.015),box((1.32,.05,.90),(.27,0,0),'Machined steel',.015),*[box((.14,.05,.25),(-.62,0,z),'Machined steel',.015) for z in [-.38,.38]]])
join('PresserFoot',[box((.12,.09,.52),(-.15,0,0),'Machined steel',.025),box((.12,.09,.52),(.15,0,0),'Machined steel',.025),box((.34,.1,.13),(0,.03,-.23),'Machined steel',.02),cyl(.045,.5,(.15,.28,-.15),'Machined steel')])
join('FeedDogs',[box((.36,.09,.55),material='Dark iron',bevel=.012),*[box((.36,.04,.025),(0,.06,z),'Machined steel',.005) for z in [-.20,-.1,0,.1,.2]]])
join('Takeup',[tube_curve([(0,0,0),(.3,.15,0),(.65,.03,0)],.045,'Machined steel'),torus(.06,.017,(.65,.03,0),'Machined steel','Z')])
join('Handwheel',[torus(.54,.085,material='Dark iron',axis='X'),cyl(.19,.25,material='Machined steel',axis='X'),*[box((.11,.92,.09),material='Machined steel')]])
join('ThreadSpool',[cyl(.22,.48,material='Exhaust copper'),*[cyl(.29,.055,(0,y,0),'Ceramic') for y in [-.27,.27]],*[torus(.222,.009,(0,y,0),'Exhaust copper') for y in [i*.025 for i in range(-9,10)]]])
export('sewing-machine')

# JET: the X axis follows the flow. Concentric spools rotate around X.
reset()
def duct(profile,arc=math.pi*1.25,material='Cast aluminum'):
 vv=[];ff=[];N=64
 for x,r in profile:
  for i in range(N+1):
   a=-arc/2+arc*i/N;vv.append((x,r*math.sin(a),-r*math.cos(a)))
 for row in range(len(profile)-1):
  for i in range(N):
   k=row*(N+1)+i;ff.append((k,k+1,k+N+2,k+N+1))
 o=mesh('Duct',vv,ff,material,.008)
 sol=o.modifiers.new('Wall thickness','SOLIDIFY');sol.thickness=.04;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=sol.name)
 return o
def rotor(name,radius,hub,blades,depth,material='Machined steel'):
 objects=[cyl(hub,depth*1.8,material='Dark iron',axis='X')]
 for i in range(blades):
  a=i*2*math.pi/blades;vv=[]
  for x in [-depth/2,depth/2]:
   for r,offset in [(hub,.00),(radius,-.11),(radius,.035),(hub,.12)]:
    twist=x*1.5;vv.append((x,r*math.sin(a+offset+twist),r*math.cos(a+offset+twist)))
  objects.append(mesh('Airfoil',vv,[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],material,.012))
 join(name,objects)
join('JetNacelle',[duct([(-3,1.45),(-2.7,1.62),(-1.8,1.6),(1.8,1.48),(2.8,1.32)]),*[duct([(x,1.63),(x+.07,1.63)],material='Machined steel') for x in [-2.75,-1.9,-.5,1,2.4]]])
join('JetCore',[duct([(-2.35,.69),(-1.7,.66),(-.6,.56),(0,.72),(.95,.73),(1.5,.55),(2.7,.46)],material='Dark iron')])
rotor('JetFan',1.39,.25,24,.22)
rotor('JetCompressor',.59,.25,22,.14)
rotor('JetTurbine',.58,.23,24,.14,'Exhaust copper')
# Stator vanes occupy only the rear cutaway sector so both rotor rows remain visible.
rotor('JetStator',.61,.28,18,.10,'Cast aluminum')
join('JetLowShaft',[cyl(.075,5.7,material='Machined steel',axis='X')])
join('JetHighShaft',[duct([(-1.8,.135),(1.8,.135)],arc=math.pi*1.05,material='Dark iron')])
join('JetSpinner',[cyl(.26,.34,material='Machined steel',axis='X'),torus(.27,.025,material='Copper',axis='X')])
join('JetCombustor',[duct([(-.35,.73),(.65,.73)],material='Exhaust copper'),*[cyl(.045,.22,(-.29,.55*math.sin(a),.55*math.cos(a)),'Machined steel','X',16,.008) for a in [i*math.pi/4 for i in range(8)]],*[torus(.70,.02,(x,0,0),'Dark iron','X') for x in [-.35,.65]]])
join('JetNozzle',[duct([(1.9,.52),(2.4,.42),(2.95,.3)],material='Machined steel')])
join('JetStand',[box((4,.15,1.35),(0,-1.93,-.1),'Dark iron',.06),*[box((.20,.50,.30),(x,-1.63,-.45),'Machined steel') for x in [-1.4,1.4]]])
export('jet-engine')

# WATCH: different depth planes expose the compound train without meshing unrelated wheels.
reset()
mat('Watch brass',(.62,.40,.14),.88,.28);mat('Jewel',(.30,.018,.045),.55,.20)
def watchgear(name,teeth,r,material='Watch brass'):
 N=teeth*4;vv=[];ff=[]
 for z in [-.035,.035]:
  for radius in [0,r*.63]:
   for i in range(N):
    a=i*2*math.pi/N
    rr=radius if radius else r+(.6 if i%4 in [1,2] else -.8)*(2*r/teeth)
    vv.append((rr*math.cos(a),rr*math.sin(a),z))
 for i in range(N):
  j=(i+1)%N
  for u,v in [(0,1),(2,3),(0,2),(1,3)]:ff.append((u*N+i,u*N+j,v*N+j,v*N+i))
 objs=[mesh('Wheel teeth',vv,ff,material,.003),cyl(r*.16,.15,material='Machined steel',axis='Z')]
 for i in range(5):
  a=i*2*math.pi/5;o=box((r*1.38,.038,.055),material=material,bevel=.009);o.rotation_euler.z=a;objs.append(o)
 join(name,objs)
for name,teeth,r in [('WatchCenter',80,.56),('WatchThird',75,.525),('WatchFourth',96,.48),('WatchPinion',10,.07),('WatchEscapePinion',6,.03),('WatchBarrelGear',60,.42),('WatchMotionWheel',36,.252),('WatchMotionPinion',10,.0672),('WatchHourWheel',40,.2688),('WatchMinutePinion',12,.084)]:watchgear(name,teeth,r)
join('WatchPlate',[cyl(1.86,.12,(0,0,-.23),'Dark iron','Z'),torus(1.78,.04,(0,0,-.13),'Machined steel','Z'),*[cyl(.045,.08,(1.66*math.cos(a),1.66*math.sin(a),-.12),'Machined steel','Z',6,.007) for a in [i*math.pi/4 for i in range(8)]]])
join('WatchBarrel',[arc_ring(.425,.38,.13,-math.pi*.8,math.pi*.8,'Watch brass'),cyl(.075,.25,material='Machined steel',axis='Z')])
join('WatchMainspring',[tube_curve([((.08+.28*i/360)*math.cos(i*math.pi/30),(.08+.28*i/360)*math.sin(i*math.pi/30),.04) for i in range(361)],.010,'Machined steel')])
# Stylized lever escapement teeth, distinct from the involute teaching train.
vv=[];ff=[];N=15
for z in [-.028,.028]:
 for i in range(N):
  for offset,r in [(0,.24),(.45,.24),(.72,.35),(.81,.35)]:
   a=(i+offset)*2*math.pi/N;vv.append((r*math.cos(a),r*math.sin(a),z))
M=N*4;ff.extend([tuple(range(M-1,-1,-1)),tuple(range(M,2*M))])
for i in range(M):ff.append((i,(i+1)%M,(i+1)%M+M,i+M))
join('WatchEscape',[mesh('Escape teeth',vv,ff,'Machined steel',.003),cyl(.06,.14,material='Watch brass',axis='Z')])
join('WatchPallet',[tube_curve([(-.24,-.32,0),(-.13,-.17,0),(0,0,0),(.13,-.17,0),(.24,-.32,0)],.030,'Watch brass'),box((.045,.45,.05),(0,.20,0),'Machined steel',.012),*[box((.04,.16,.055),(x,.46,0),'Watch brass',.009) for x in [-.065,.065]],cyl(.06,.16,material='Machined steel',axis='Z'),*[box((.11,.055,.09),(x,-.31,0),'Jewel',.008) for x in [-.24,.24]]])
join('WatchBalance',[torus(.48,.041,material='Watch brass',axis='Z'),box((.93,.035,.06),material='Watch brass',bevel=.01),box((.035,.93,.06),material='Watch brass',bevel=.01),cyl(.06,.25,material='Machined steel',axis='Z'),*[cyl(.018,.05,(.48*math.cos(a),.48*math.sin(a),.035),'Machined steel','Z',12,.004) for a in [i*math.pi/6 for i in range(12)]],cyl(.018,.05,(0,-.29,.05),'Jewel','Z',12,.003)])
join('WatchJewel',[torus(.06,.019,material='Jewel',axis='Z'),cyl(.019,.10,material='Machined steel',axis='Z')])
join('WatchBridge',[box((.22,1.2,.10),material='Cast aluminum',bevel=.07),*[cyl(.055,.08,(0,y,.06),'Machined steel','Z',6,.008) for y in [-.47,.47]]])
join('WatchMinuteHand',[mesh('Minute hand',[(-.028,-.12,0),(.028,-.12,0),(.019,.54,0),(0,.66,0),(-.019,.54,0)],[(0,1,2,3,4)],'Intake blue',0),cyl(.047,.065,material='Machined steel',axis='Z')])
join('WatchHourHand',[mesh('Hour hand',[(-.035,-.09,0),(.035,-.09,0),(.032,.33,0),(0,.44,0),(-.032,.33,0)],[(0,1,2,3,4)],'Ceramic',0)])
join('WatchSecondHand',[box((.015,.76,.015),(0,.28,0),'Exhaust copper',.005)])
join('WatchCrown',[cyl(.13,.24,material='Machined steel',axis='X'),*[torus(.13,.008,(x,0,0),'Dark iron','X') for x in [-.08,-.04,0,.04,.08]],cyl(.035,.8,(-.45,0,0),'Machined steel','X')])
export('mechanical-watch')
